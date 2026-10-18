---
id: muestreo-de-bola-de-nieve
titulo: Muestreo de bola de nieve
titulo_en: Snowball sampling
alias:
  - muestreo por referencias
  - muestreo en cadena
  - muestreo dirigido por los participantes
modulo: 5
submodulo: '5.1'
orden: 11
nivel: basico
prerrequisitos:
  - muestreo-por-conveniencia
relaciones:
  - tipo: relacionado
    id: marco-muestral
etiquetas:
  - poblaciones ocultas
  - redes sociales
  - muestreo no probabilístico
  - referencias
resumen: >
  Se parte de unas pocas personas de una población difícil de encontrar y cada una refiere a otras
  que conoce, ola tras ola. Permite llegar a poblaciones sin marco muestral, pero sobrerrepresenta a
  quienes tienen más contactos.
formula: 'P(i \text{ reclutado}) \propto d_i \quad \text{(aproximadamente, tras varias olas)}'
visualizacion:
  componente: SamplingProcess
  parametros:
    modo: bola-de-nieve
    tamano: 170
    proporcion: 0.25
    homofilia: 0.9
    semillas: 3
    cupones: 3
    olas: 5
    nombreMiembro: Paciente
    semilla: 7
referencias:
  - clave: lohr
    capitulo: '1'
  - clave: newman
publicado: true
---

## Intuición

Para estudiar a personas que viven con una enfermedad rara no existe una lista a la cual sortear: no aparecen como tales en ningún padrón y son muy pocas como para encontrarlas visitando hogares al azar. Lo que sí existe es la red que forman entre ellas: comparten médicos especialistas, grupos de apoyo, foros. Un equipo de investigación contacta a tres pacientes, les pide que inviten a otros que conozcan, y a esos les pide lo mismo. La muestra crece como una bola de nieve que rueda.

El **muestreo de bola de nieve** resuelve un problema real: llegar a una población oculta. Pero quién entra depende de la red. Una persona que conoce a muchos otros pacientes recibe muchas invitaciones; una persona aislada, ninguna. Las primeras semillas también pesan: si todas vienen del mismo hospital, la muestra se quedará en su vecindario de la red. Por eso, las proporciones que se calculan con la muestra describen a los pacientes bien conectados, no necesariamente a todos.

## Definición

:::definicion[Muestreo de bola de nieve]
Se elige un conjunto inicial de **semillas** de la población objetivo. En cada **ola**, cada persona reclutada refiere hasta $c$ contactos de la población objetivo que aún no han participado; los referidos forman la siguiente ola. El proceso se detiene tras un número fijo de olas o al alcanzar el tamaño deseado.
:::

En una red donde la persona $i$ tiene $d_i$ contactos dentro de la población objetivo, tras varias olas la probabilidad de ser reclutada crece aproximadamente con $d_i$, porque cada contacto es una oportunidad de recibir una invitación:
$$
P(i \text{ reclutado}) \propto d_i.
$$
Por eso el grado promedio de los reclutados, $\bar{d}_{\mathrm{rec}}$, suele ser mayor que el de la población, $\bar{d}$. Métodos como el muestreo dirigido por los participantes corrigen este sesgo ponderando a cada persona por $1/d_i$, bajo supuestos sobre cómo se forman las referencias.

:::nota[Qué significa cada símbolo]
- $c$: número máximo de referencias (cupones) por persona.
- $d_i$: número de contactos de la persona $i$ dentro de la población objetivo (su grado).
- $\bar{d}$: grado promedio de toda la población objetivo; $\bar{d}_{\mathrm{rec}}$: grado promedio de los reclutados.
- $1/d_i$: peso que compensa la mayor probabilidad de reclutar a quien tiene más contactos.
:::

## Cómo usar la visualización

Cada punto es una persona de una red social; los azules son pacientes con la enfermedad, los grises el resto. Al reproducir aparecen las semillas y luego cada ola de referidos, con líneas gruesas de quien invitó a quien. Las lecturas comparan el número promedio de contactos entre pacientes de los reclutados y de todos los pacientes.

Experimentos sugeridos:

- Observa que el promedio de contactos de los reclutados es mayor que el de todos los pacientes.
- Reduce las referencias por persona a 1: la cadena avanza más lento y en cinco olas alcanza a menos pacientes.
- Cambia la semilla: con otras semillas, la bola de nieve llega a otro grupo de pacientes.

## Ejemplo

Una red tiene 40 pacientes: 30 con 2 contactos con otros pacientes y 10 con 8 contactos.

1. Grado promedio de la población: $\bar{d} = (30 \cdot 2 + 10 \cdot 8)/40 = 3.5$.
2. Si la probabilidad de ser reclutado es proporcional al grado, el peso total de los muy conectados es $10 \cdot 8 = 80$ y el de los demás $30 \cdot 2 = 60$.
3. Entre los reclutados, la fracción de muy conectados es $80/140 = 0.57$, aunque en la población son $10/40 = 0.25$.
4. Grado promedio esperado de los reclutados: $0.57 \cdot 8 + 0.43 \cdot 2 = 5.4$.
5. Ponderando a cada reclutado por $1/d_i$, la fracción de muy conectados vuelve a $\frac{0.57/8}{0.57/8 + 0.43/2} = 0.25$.

:::figura[Una sola semilla con dos referencias por persona: la cadena de reclutamiento se queda en el grupo de pacientes que rodea a la semilla.]{componente="SamplingProcess"}
```yaml
modo: bola-de-nieve
tamano: 170
proporcion: 0.25
homofilia: 0.9
semillas: 1
cupones: 2
olas: 6
nombreMiembro: Paciente
semilla: 9
```
:::

## Propiedades

- **No requiere marco muestral**: solo un punto de entrada a la red.
- **Sobrerrepresenta a las personas con más contactos**, porque reciben más invitaciones.
- **Depende de las semillas**: con pocas olas, la composición de la muestra refleja la de las semillas.
- **La homofilia alarga la dependencia**: si los contactos se parecen entre sí, la muestra tarda muchas olas en salir del grupo inicial.

:::figura[Propiedad de dependencia de las semillas: en una red donde los pacientes forman dos comunidades poco conectadas, las dos semillas caen en la misma comunidad y en cuatro olas la cadena no cruza a la otra. Cambia la semilla para ver otra cadena.]{componente="SamplingProcess"}
```yaml
modo: bola-de-nieve
tamano: 200
proporcion: 0.3
homofilia: 0.98
semillas: 2
cupones: 2
olas: 4
nombreMiembro: Paciente
semilla: 211
```
:::

## Errores comunes

- **Reportar proporciones de la muestra como si fueran de la población.** Las personas con más contactos pesan de más; sin una corrección por grado, las proporciones están sesgadas.
- **Elegir semillas por comodidad**, todas del mismo centro de atención, y suponer que unas pocas olas bastan para "olvidar" ese origen.
- **Usar bola de nieve cuando sí existe un marco.** Si hay un registro de la población, un diseño probabilístico sobre ese registro es preferible.

:::figura[Error de reportar proporciones sin corregir: tras dos olas con tres referencias por persona, los músicos reclutados tienen en promedio alrededor de 60 % más contactos que el conjunto de músicos independientes que se quiere describir.]{componente="SamplingProcess"}
```yaml
modo: bola-de-nieve
tamano: 200
proporcion: 0.35
homofilia: 0.85
semillas: 4
cupones: 3
olas: 2
nombreMiembro: Músico
semilla: 5
```
:::

## Conexiones

El muestreo de bola de nieve es una forma estructurada de [[muestreo-por-conveniencia]] para poblaciones sin [[marco-muestral]]. Su sesgo depende de la estructura de la red, en particular del grado de cada persona y de la homofilia, temas centrales del análisis de redes. Comparte con el muestreo con probabilidad proporcional al tamaño la idea de que algunas unidades entran con más probabilidad que otras; la diferencia es que aquí esas probabilidades no se conocen de antemano.

## Formulario

:::formula[Probabilidad de reclutamiento aproximada]
$$
P(i \text{ reclutado}) \propto d_i
$$

- $d_i$: número de contactos de la persona $i$ dentro de la población objetivo.
:::

:::formula[Proporción corregida por grado]
$$
\hat{p} = \frac{\sum_{i \in \mathcal{S}} \mathbf{1}\{i \in A\}/d_i}{\sum_{i \in \mathcal{S}} 1/d_i}
$$

- $\mathcal{S}$: personas reclutadas.
- $\mathbf{1}\{i \in A\}$: vale 1 si la persona tiene la característica $A$ y 0 si no.
- $1/d_i$: peso de la persona $i$.
:::
