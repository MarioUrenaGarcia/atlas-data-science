---
id: permutaciones-circulares
titulo: Permutaciones circulares
titulo_en: Circular permutations
alias:
  - acomodos en una mesa redonda
  - permutaciones en círculo
  - collares
modulo: 0
submodulo: '0.2'
orden: 6
nivel: basico
prerrequisitos:
  - permutaciones
relaciones:
  - tipo: relacionado
    id: relaciones-y-relaciones-de-equivalencia
etiquetas:
  - conteo
  - simetría
  - rotaciones
  - clases de equivalencia
resumen: >
  Al acomodar n objetos distintos en un círculo, dos acomodos que difieren por un giro se consideran
  iguales, por lo que hay (n - 1)! acomodos; si además los reflejos son iguales, hay (n - 1)!/2.
formula: '\frac{n!}{n} = (n-1)!'
visualizacion:
  componente: CombinatoricsBoard
  parametros:
    modo: circular
    personas: [Ana, Beto, Caro, Dani, Eli]
referencias:
  - clave: ross-probabilidad
    capitulo: '1'
publicado: true
---

## Intuición

Cinco amigos cenan en una mesa redonda. Lo que importa es quién queda a la derecha y a la izquierda de cada quien, no en qué silla concreta se sienta cada uno: si todos se recorren un lugar hacia la derecha, las vecindades no cambian y el acomodo es el mismo.

Si las sillas estuvieran en fila, habría $5! = 120$ órdenes. En la mesa redonda, cada acomodo corresponde a 5 órdenes en fila, uno por cada silla en la que puede empezar la lectura alrededor de la mesa. Por eso hay $120 / 5 = 24$ acomodos distintos. Otra forma de verlo: se fija a una persona en cualquier silla, lo que elimina los giros, y las otras cuatro se ordenan de $4! = 24$ maneras a partir de ella.

Si además se considera igual un acomodo y su reflejo, como ocurre con las cuentas de un collar que se puede voltear, cada clase reúne el doble de órdenes y el número se reduce a la mitad.

## Definición

Dos ordenamientos $(a_1, \dots, a_n)$ y $(b_1, \dots, b_n)$ de $n$ objetos distintos son **equivalentes por rotación** si existe $r$ con $b_i = a_{i + r}$ para todo $i$, con índices tomados módulo $n$. Una **permutación circular** es una clase de equivalencia de esta relación.

:::teorema
Para $n \ge 1$ hay $(n-1)!$ permutaciones circulares de $n$ objetos distintos. Si además se identifican los reflejos, para $n \ge 3$ hay $\frac{(n-1)!}{2}$.
:::

:::demostracion
Cada clase contiene exactamente $n$ ordenamientos en fila, los $n$ giros de uno de ellos, que son distintos entre sí porque los objetos son distintos. Por lo tanto el número de clases es $n!/n = (n-1)!$. Para $n \ge 3$, el reflejo de un acomodo no es ninguno de sus giros, así que al identificar reflejos cada clase tiene $2n$ ordenamientos.
:::

## Cómo usar la visualización

La mesa muestra el acomodo actual. La reproducción recorre todos los órdenes en fila y deposita cada uno en la tarjeta de su acomodo circular; cada tarjeta nombra el acomodo leído a partir de la primera persona y tiene un medidor con una celda por giro. El control cambia el número de personas.

Con 4 personas hay 24 órdenes y 6 tarjetas de 4 celdas. Al activar "Considerar iguales los reflejos", las tarjetas se reducen a 3 y cada una necesita 8 órdenes para llenarse. Con 3 personas y reflejos, queda una sola tarjeta: los tres únicos órdenes posibles alrededor de una mesa de tres son reflejos o giros entre sí.

## Ejemplo

Una ronda de negociación reúne a 7 representantes de países distintos en una mesa redonda.

1. Los acomodos distintos, salvo giros, son $(7 - 1)! = 720$.
2. Si dos representantes que no se llevan bien no deben sentarse juntos, se cuentan primero los acomodos en que sí quedan juntos: se pegan como un bloque, se acomodan 6 unidades en círculo, $(6-1)! = 120$, y el bloque tiene 2 órdenes internos: $240$.
3. Por complemento, hay $720 - 240 = 480$ acomodos en que quedan separados.

## Propiedades

- **Fijar un elemento** elimina la simetría de rotación: las permutaciones circulares de $n$ objetos corresponden a las permutaciones lineales de los otros $n - 1$ a partir de él.
- **Collares y pulseras:** si además se permite voltear, el conteo se divide entre $2n$ en lugar de $n$.
- **Objetos repetidos:** cuando hay objetos idénticos, las clases dejan de tener todas el mismo tamaño y la fórmula $n!/n$ ya no es válida; se requiere contar órbitas con más cuidado.
- Es un ejemplo del principio general: si cada objeto se contó exactamente $m$ veces, se divide entre $m$.

## Errores comunes

- **Aplicar $(n-1)!$ cuando las sillas están numeradas.** Si cada lugar tiene un nombre, los giros sí producen acomodos distintos y hay $n!$.
- **Dividir entre 2 sin justificación.** Solo corresponde si el reflejo realmente se considera el mismo acomodo, como en un collar; en una mesa con izquierda y derecha distinguibles, no.
- **Usar la fórmula con objetos idénticos.** Con cuentas repetidas, algunos acomodos coinciden con sus propios giros y el cociente deja de ser exacto.

## Conexiones

Las permutaciones circulares son clases de [[permutaciones]] bajo la [[relaciones-y-relaciones-de-equivalencia|relación de equivalencia]] "difieren por un giro". Comparten la idea de dividir entre el tamaño de las clases con las [[permutaciones-con-repeticion]] y las [[combinaciones]]. El conteo con simetrías más generales se estudia con el lema de Burnside en teoría de grupos.
