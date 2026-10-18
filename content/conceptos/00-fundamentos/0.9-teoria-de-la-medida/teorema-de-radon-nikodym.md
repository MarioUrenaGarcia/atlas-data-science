---
id: teorema-de-radon-nikodym
titulo: Teorema de Radon-Nikodym
titulo_en: Radon-Nikodym theorem
alias:
  - derivada de Radon-Nikodym
  - dν/dμ
  - continuidad absoluta
  - densidad respecto de una medida
modulo: 0
submodulo: '0.9'
orden: 11
nivel: avanzado
prerrequisitos:
  - integral-de-lebesgue
  - conjuntos-de-medida-cero-y-propiedades-casi-seguras
etiquetas:
  - densidades
  - continuidad absoluta
  - cambio de medida
  - teoría de la medida
resumen: >
  Si ν es absolutamente continua respecto de μ, es decir, no da masa a los conjuntos que μ considera nulos,
  entonces existe una densidad g con ν(A) = ∫_A g dμ. Esa g es la derivada de Radon-Nikodym dν/dμ.
formula: '\nu \ll \mu \;\Longrightarrow\; \nu(A) = \int_A \frac{d\nu}{d\mu}\,d\mu \quad \text{para todo } A \in \mathcal{F}'
visualizacion:
  componente: MeasureLab
  parametros:
    modo: radon
    densidad: lineal
referencias:
  - clave: durrett
  - clave: wasserman
publicado: true
---

## Intuición

Una barra metálica de un metro tiene densidad variable: más pesada en un extremo que en el otro. Se pueden medir dos cosas en cada tramo: su longitud y su masa. El cociente masa entre longitud de un tramo pequeño es la densidad en ese lugar, y la masa de cualquier tramo se recupera integrando la densidad sobre él. El teorema de Radon-Nikodym dice cuándo existe esa densidad para dos medidas cualesquiera.

La condición es natural: la segunda medida no puede dar masa a donde la primera no da longitud. Si un punto tuviera masa positiva, la densidad tendría que ser infinita ahí. Cuando ninguna región de longitud cero tiene masa, la medida se llama absolutamente continua y la densidad existe, única salvo conjuntos de medida cero.

Las funciones de densidad de probabilidad son exactamente esto: derivadas de Radon-Nikodym de una distribución respecto de la medida de Lebesgue. También lo son las funciones de masa respecto de la medida de conteo, y los cocientes de verosimilitud entre dos modelos.

## Definición

:::definicion[Continuidad absoluta]
Sean $\mu$ y $\nu$ medidas sobre $(\Omega, \mathcal{F})$. Se dice que $\nu$ es absolutamente continua respecto de $\mu$, $\nu \ll \mu$, si $\mu(A) = 0$ implica $\nu(A) = 0$.
:::

:::teorema[Teorema de Radon-Nikodym]
Si $\mu$ y $\nu$ son sigma-finitas y $\nu \ll \mu$, existe una función medible $g \ge 0$ tal que
$$
\nu(A) = \int_A g\,d\mu \quad \text{para todo } A \in \mathcal{F}.
$$
La función $g$ es única $\mu$-c.t.p. y se escribe $g = \dfrac{d\nu}{d\mu}$.
:::

Una medida es sigma-finita si $\Omega$ es unión numerable de conjuntos de medida finita, como la medida de Lebesgue en $\mathbb{R}$.

:::nota[Qué significa cada símbolo]
- $\mu$, $\nu$: medidas sobre el mismo espacio medible $(\Omega, \mathcal{F})$.
- $\nu \ll \mu$: $\nu$ es absolutamente continua respecto de $\mu$.
- $A$: conjunto medible.
- $g = d\nu/d\mu$: derivada de Radon-Nikodym, una densidad no negativa.
- $\int_A g\,d\mu$: integral de $g$ sobre $A$ respecto de $\mu$.
- $\mu$-c.t.p.: salvo un conjunto de $\mu$-medida cero.
:::

## Cómo usar la visualización

La medida $\mu$ es la longitud en $[0, 1]$ y $\nu$ tiene densidad $g(x) = 2x$. El intervalo se parte en $2^k$ celdas iguales y la altura de cada barra es $\nu(I)/\mu(I)$, la masa por unidad de longitud de la celda. La curva es $g$. La reproducción duplica el número de celdas en cada paso, hasta 128; la celda que contiene a 0.3 se resalta.

Con una celda el cociente vale 1; con dos, la celda $[0, 0.5]$ da 0.5; luego 0.75, 0.625 y 0.5625, y con 128 celdas da 0.6016, frente a $g(0.3) = 0.6$. Las barras se pegan a la recta: la derivada aparece como límite de cocientes de medidas.

## Ejemplo

Sea $\nu(A) = \int_A 2x\,dx$ en $[0, 1]$.

1. $\nu \ll \lambda$: si $\lambda(A) = 0$, la integral sobre $A$ es 0.
2. En $I = [0.25, 0.5]$: $\nu(I) = 0.5^2 - 0.25^2 = 0.1875$ y $\lambda(I) = 0.25$, con cociente 0.75.
3. En $I = [0.25, 0.3125]$: $\nu(I) = 0.0977 - 0.0625 = 0.0352$ y $\lambda(I) = 0.0625$, con cociente 0.5625.
4. Cuando las celdas se encogen alrededor de 0.3, el cociente tiende a $\frac{d\nu}{d\lambda}(0.3) = 2 \cdot 0.3 = 0.6$.

:::figura[Densidad ondulada $1 + 0.8\sin(2\pi x)$: el cociente en la celda que contiene a 0.3 pasa de 1 a 1.509 durante dos pasos, luego a 1.720 y 1.780, y con 128 celdas vale 1.7595, junto a $g(0.3) = 1.7608$.]{componente="MeasureLab"}
```yaml
modo: radon
densidad: onda
```
:::

## Propiedades

- **Regla de la cadena:** si $\rho$ es una tercera medida sigma-finita y $\rho \ll \nu \ll \mu$, entonces $\frac{d\rho}{d\mu} = \frac{d\rho}{d\nu}\,\frac{d\nu}{d\mu}$ c.t.p.
- **Cambio de medida:** $\int f\,d\nu = \int f\,\frac{d\nu}{d\mu}\,d\mu$ para $f$ medible no negativa.
- **Densidades de probabilidad:** si $X$ tiene densidad $f_X$, entonces $f_X = dP_X/d\lambda$ y $P(X \in A) = \int_A f_X\,d\lambda$.
- **Verosimilitudes:** para dos modelos $P \ll Q$, la derivada $dP/dQ$ es el cociente de verosimilitudes, y $D_{\mathrm{KL}}(P \,\|\, Q) = \int \log \frac{dP}{dQ}\,dP$, la divergencia de Kullback-Leibler, con $\log$ el logaritmo natural.
- **Descomposición de Lebesgue:** si $\mu$ y $\nu$ son sigma-finitas, $\nu$ se escribe como $\nu_{ac} + \nu_s$, con $\nu_{ac} \ll \mu$ y $\nu_s$ concentrada en un conjunto $\mu$-nulo.

## Errores comunes

- **Suponer que toda distribución tiene densidad.** Una variable que vale 0 con probabilidad 1/2 da masa a un punto de longitud cero; no es absolutamente continua respecto de Lebesgue y no tiene densidad.
- **Esperar que la derivada esté definida en cada punto.** Es única solo c.t.p.: en la densidad escalonada, el valor en $x = 1/2$ puede ser 0.5, 1.5 o cualquier otro sin cambiar $\nu$.

:::figura[Densidad escalonada 0.5 y 1.5: desde dos celdas, los cocientes de la mitad izquierda valen exactamente 0.5, y la derivada se reconoce sin error mientras las celdas no crucen el salto; el valor en x = 1/2 no influye en ningún cociente.]{componente="MeasureLab"}
```yaml
modo: radon
densidad: escalon
```
:::

- **Pensar que continuidad absoluta y continuidad de la función de distribución son lo mismo.** La función de Cantor es continua, pero su distribución vive en el conjunto de Cantor, de medida cero, y no tiene densidad.
- **Olvidar la sigma-finitud.** Con $\mu$ la medida de conteo en $[0, 1]$ y $\nu$ la de Lebesgue se cumple $\nu \ll \mu$, pero no existe densidad; la medida de conteo no es sigma-finita en un conjunto no numerable.

## Conexiones

Usa la [[integral-de-lebesgue]] y los [[conjuntos-de-medida-cero-y-propiedades-casi-seguras]] para definir la continuidad absoluta. La [[funcion-de-densidad-de-probabilidad]] es una derivada de Radon-Nikodym respecto de la longitud, y la [[divergencia-de-kullback-leibler]] y las [[divergencias-f]] se escriben con ella para distribuciones cualesquiera.

## Formulario

:::formula[Continuidad absoluta]
$$
\nu \ll \mu \iff \big(\mu(A) = 0 \Rightarrow \nu(A) = 0\big)
$$

- $\mu$, $\nu$: medidas; $A$: conjunto medible.
:::

:::formula[Derivada de Radon-Nikodym]
$$
\nu(A) = \int_A \frac{d\nu}{d\mu}\,d\mu
$$

- $d\nu/d\mu$: densidad de $\nu$ respecto de $\mu$, única c.t.p.
:::

:::formula[Cambio de medida]
$$
\int f\,d\nu = \int f\,\frac{d\nu}{d\mu}\,d\mu
$$

- $f$: función medible no negativa o integrable respecto de $\nu$.
:::

:::formula[Cociente en celdas pequeñas]
$$
\frac{\nu(I)}{\mu(I)} \to \frac{d\nu}{d\mu}(x) \quad \text{cuando } I \downarrow \{x\}
$$

- $I$: intervalos que contienen a $x$ y se encogen; vale c.t.p. para $\mu$ la medida de Lebesgue.
:::
